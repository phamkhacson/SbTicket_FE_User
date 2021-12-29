import fetch from "isomorphic-unfetch";
import { API_ROOT } from "../utils/config";
import instance from "../services";

export const login = async (form) => {
  return instance.post('/login', form)
}

export const register = async (form) => {
  return instance.post('/register', form)
}

export const getCustomerDetail = async (id) => {
  return instance.get(`/user/customerDetail/${id}`)
}

export const updateCustomer = async (customerId, body) => {
  return instance.put(`${API_ROOT}/user/updateCustomer/${customerId}`, body)
}