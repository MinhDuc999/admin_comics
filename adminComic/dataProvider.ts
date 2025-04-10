import { DataProvider } from '@refinedev/core';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import queryString from 'query-string';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
});

axiosInstance.interceptors.request.use((config) => {
  const auth = localStorage.getItem('auth');
  if (auth) {
    try {
      const { credential } = JSON.parse(auth);
      console.log(
        'Adding token to request:',
        credential.substring(0, 10) + '...',
      );
      config.headers.Authorization = `Bearer ${credential}`;
    } catch (error) {
      console.error('Error parsing auth from localStorage:', error);
    }
  } else {
    console.warn('No auth found in localStorage');
  }

  console.log('Request config:', {
    url: config.url,
    method: config.method,
    data: config.data,
  });

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    console.log('API Success:', {
      url: response.config.url,
      method: response.config.method,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  },
);

const normalizeData = (response: any) => {
  if (response && typeof response === 'object') {
    if (response.data !== undefined) {
      return response.data;
    }
  }
  return response;
};

export const dataProvider: DataProvider = {
  getList: async ({ resource, pagination, sorters, filters, meta }) => {
    const url = `/${resource}`;

    const { current = 1, pageSize = 10, mode = 'server' } = pagination || {};

    const query: Record<string, string | number> = {};

    if (mode === 'server') {
      query._page = current;
      query._limit = pageSize;
    }

    if (sorters && sorters.length > 0) {
      query._sort = sorters[0].field;
      query._order = sorters[0].order === 'asc' ? 'asc' : 'desc';
    }

    if (filters && filters.length > 0) {
      filters.forEach((filter) => {
        if (filter.operator === 'eq') {
          query[filter.field] = filter.value;
        }
      });
    }

    try {
      const { data, headers } = await axiosInstance.get(url, {
        params: query,
      });

      const normalizedData = Array.isArray(data) ? data : data.data || [];
      const totalCount = headers['x-total-count']
        ? parseInt(headers['x-total-count'], 10)
        : normalizedData.length || 0;

      return {
        data: normalizedData,
        total: totalCount,
      };
    } catch (error) {
      console.error(`Error fetching ${resource} list:`, error);
      return {
        data: [],
        total: 0,
      };
    }
  },

  getOne: async ({ resource, id, meta }) => {
    try {
      console.log(`Fetching ${resource}/${id} details`);
      const { data } = await axiosInstance.get(`/${resource}/${id}`);
      console.log(`Got ${resource}/${id} details:`, data);
      return {
        data: normalizeData(data),
      };
    } catch (error) {
      console.error(`Error fetching ${resource}/${id}:`, error);
      throw error;
    }
  },

  create: async ({ resource, variables, meta }) => {
    try {
      console.log(`Creating ${resource} with variables:`, variables);
      const { data } = await axiosInstance.post(`/${resource}`, variables);
      console.log(`Create ${resource} response:`, data);
      return {
        data: normalizeData(data),
      };
    } catch (error) {
      console.error(`Error creating ${resource}:`, error);
      throw error;
    }
  },

  update: async ({ resource, id, variables, meta }) => {
    try {
      console.log(`Updating ${resource}/${id} with variables:`, variables);
      const { data } = await axiosInstance.put(`/${resource}/${id}`, variables);
      console.log(`Update ${resource}/${id} response:`, data);
      return {
        data: normalizeData(data),
      };
    } catch (error) {
      console.error(`Error updating ${resource}/${id}:`, error);
      throw error;
    }
  },

  deleteOne: async ({ resource, id, meta }) => {
    try {
      console.log(`Deleting ${resource}/${id}`);
      const { data } = await axiosInstance.delete(`/${resource}/${id}`);
      console.log(`Delete ${resource}/${id} response:`, data);
      return {
        data: normalizeData(data),
      };
    } catch (error) {
      console.error(`Error deleting ${resource}/${id}:`, error);
      throw error;
    }
  },

  getApiUrl: () => {
    return axiosInstance.defaults.baseURL || '';
  },

  custom: async ({
    url,
    method,
    filters,
    sorters,
    payload,
    query,
    headers,
  }) => {
    let requestUrl = `${url}`;

    if (query) {
      requestUrl = `${requestUrl}?${queryString.stringify(query)}`;
    }

    const requestConfig: AxiosRequestConfig = {};

    if (headers) {
      requestConfig.headers = headers;
    }

    try {
      console.log(`Custom request to ${url} with method ${method}:`, {
        payload,
        query,
      });

      let axiosResponse;
      switch (method) {
        case 'put':
        case 'post':
        case 'patch':
          axiosResponse = await axiosInstance[method](
            url,
            payload,
            requestConfig,
          );
          break;
        case 'delete':
          axiosResponse = await axiosInstance.delete(url, {
            ...requestConfig,
            data: payload,
          });
          break;
        default:
          axiosResponse = await axiosInstance.get(requestUrl, requestConfig);
          break;
      }

      console.log(`Custom request to ${url} response:`, axiosResponse.data);
      return { data: normalizeData(axiosResponse.data) };
    } catch (error) {
      console.error(`Error in custom request to ${url}:`, error);
      throw error;
    }
  },
};
