import fetch from "isomorphic-unfetch";
import { API_ROOT } from "../utils/config";
import instance from "../services";

export const getAllLocations = async () => {
  const resp = await fetch(`${API_ROOT}/user/getLocation`);
  const response = await resp.json();
  return response.body;
};

export const searchBus = async query => {
  const response = await instance.post('/user/findByTripBus', query)
  return response.body;
};

export const searchBusByFilter = async body => {
  const resp = await fetch(`${API}/bus/filter`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  const response = await resp.json();
  return response;
};
