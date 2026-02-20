export const GET_PRODUCTS_QUERY = `
  query GetProducts {
    products {
      id
      name
      price
      quantity
      createdBy {
        id
        email
        role
      }
    }
  }
`;

export const GET_DASHBOARD_STATS_QUERY = `
  query GetDashboardStats {
    dashboardStats {
      totalProducts
      totalQuantity
    }
  }
`;

export const LOGIN_MUTATION = `
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
`;

export const CREATE_PRODUCT_MUTATION = `
  mutation CreateProduct($createProductInput: CreateProductInput!) {
    createProduct(createProductInput: $createProductInput) {
      id
      name
      price
      quantity
    }
  }
`;

export const UPDATE_PRODUCT_MUTATION = `
  mutation UpdateProduct($id: String!, $updateProductInput: UpdateProductInput!) {
    updateProduct(id: $id, updateProductInput: $updateProductInput) {
      id
      name
      price
      quantity
    }
  }
`;

export const DELETE_PRODUCT_MUTATION = `
  mutation DeleteProduct($id: String!) {
    removeProduct(id: $id) {
      id
      name
    }
  }
`;
