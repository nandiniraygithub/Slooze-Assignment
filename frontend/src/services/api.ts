import api from '@/lib/axios';

// --- Auth Service ---
export const AuthService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/graphql', {
      query: `
        mutation Login($loginInput: LoginInput!) {
          login(loginInput: $loginInput) {
            accessToken
            user {
              id
              email
              role
            }
          }
        }
      `,
      variables: {
        loginInput: { email, password },
      },
    });
    return response.data;
  },

  createStoreKeeper: async (email: string, password: string) => {
    const response = await api.post('/graphql', {
      query: `
        mutation CreateStoreKeeper($registerInput: RegisterInput!) {
          createStoreKeeper(registerInput: $registerInput) {
            user {
              id
              email
              role
            }
          }
        }
      `,
      variables: {
        registerInput: { email, password },
      },
    });
    return response.data;
  },
};

// --- Dashboard Service ---
export const DashboardService = {
  getStats: async () => {
    const response = await api.post('/graphql', {
      query: `
        query GetDashboardStats {
          dashboardStats {
            totalProducts
            totalQuantity
          }
        }
      `,
    });
    return response.data?.data?.dashboardStats;
  },
};

// --- User Service ---
export const UserService = {
  getStoreKeepers: async () => {
    const response = await api.post('/graphql', {
      query: `
        query GetStoreKeepers {
          storeKeepers {
            id
            email
            role
            createdAt
          }
        }
      `,
    });
    return response.data?.data?.storeKeepers || [];
  },
};

// --- Product Service ---
export const ProductService = {
  getAll: async () => {
    const response = await api.post('/graphql', {
      query: `
        query GetProducts {
          products {
            id
            name
            price
            quantity
            imageUrl
            createdBy {
              id
              email
              role
            }
          }
        }
      `,
    });
    return response.data?.data?.products || [];
  },

  create: async (productData: any) => {
    const response = await api.post('/graphql', {
      query: `
        mutation CreateProduct($createProductInput: CreateProductInput!) {
          createProduct(createProductInput: $createProductInput) {
            id
            name
            price
            quantity
            imageUrl
            createdBy {
              id
              email
              role
            }
          }
        }
      `,
      variables: {
        createProductInput: productData,
      },
    });
    return response.data;
  },

  update: async (id: string, productData: any) => {
    const response = await api.post('/graphql', {
      query: `
        mutation UpdateProduct($id: String!, $updateProductInput: UpdateProductInput!) {
          updateProduct(id: $id, updateProductInput: $updateProductInput) {
            id
            name
            price
            quantity
            imageUrl
          }
        }
      `,
      variables: {
        id,
        updateProductInput: productData,
      },
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.post('/graphql', {
      query: `
        mutation DeleteProduct($id: String!) {
          removeProduct(id: $id) {
            id
          }
        }
      `,
      variables: { id },
    });
    return response.data;
  },

  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/api/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
