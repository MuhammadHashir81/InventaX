import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '../../api/api'


export const signUpUser = createAsyncThunk('/api/auth/signup', async (data, { rejectWithValue }) => {

  try {
    const response = await api.post('/api/auth/signup', data)
    console.log(response.success)
    console.log(response)
    return {
      success: response.message,
      role: response.role,
      user: response.data.username
    }

  } catch (error) {
    console.log(error.response?.data.error)
    return rejectWithValue(error.response?.data.error)

  }
})

// Thunk
export const loginUser = createAsyncThunk(
  'users/fetchByIdStatus',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/auth/login`, data)
      console.log("fetching admin...", response)

      if (response.role === 'admin') {
        window.location.href = '/super-admin'
      }
      if (response.role === 'user') {
        window.location.href = '/'
      }

      return {
        user: response.user,
        success: response.success,
        role: response.role
      } 

    } catch (error) {
      return rejectWithValue(error.response?.data.error)
    }
  }
)


// check auth- check if the user is logged in or not 

export const checkingAuth = createAsyncThunk('users/checkingAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/auth/check')
      console.log("checking if the user is logged in or not ", response)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data.error)

    }

  })

// Slice
const adminAuthSlice = createSlice({
  name: 'admin',
  initialState: {
    admin: null,
    loading: false,
    isAuthenticated: false,
    checkAuth: true,
    success: null,
    error: null,
    role: null,
    user: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null
      state.success = null
    }
  },

  extraReducers: (builder) => {


    builder
      .addCase(loginUser.pending, (state, action) => {
        state.admin = null
        state.loading = true
        state.error = null
        state.isAuthenticated = false
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.admin = action.payload.user
        state.loading = false
        state.success = action.payload.success
        state.isAuthenticated = true
        state.role = action.payload.role
        state.user = action.payload.user

      })
      .addCase(loginUser.rejected, (state, action) => {
        state.admin = null
        state.loading = false
        state.error = action.payload
      })
      // checking if the user is logged in or not 

      .addCase(checkingAuth.pending, (state, action) => {
        state.loading = true,
          state.checkAuth = true
      })
      .addCase(checkingAuth.fulfilled, (state, action) => {
        state.loading = false,
          state.checkAuth = false
        state.isAuthenticated = true
        state.role = action.payload.role
        state.user = action.payload.user
        state.success = action.payload

      })
      .addCase(checkingAuth.rejected, (state, action) => {
        state.error = action.payload
        state.checkAuth = false
        state.user = null
      })
      .addCase(signUpUser.pending, (state, action) => {
        state.loading = true
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.loading = false
        state.success = action.payload.success
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})
export const { clearError } = adminAuthSlice.actions

export default adminAuthSlice.reducer
