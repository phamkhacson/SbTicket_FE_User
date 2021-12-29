import fetch from "isomorphic-unfetch";
import { API_ROOT } from "../utils/config";
import instance from "../services";

export const postSoldSeat = (slug, seat) =>
  axios.post(`/bookings/sold/${slug}`, { seatNumber: seat });

export const postBookSeat = async (body) => {
  return instance.post(`${API_ROOT}/user/bookSeat`, body);
};
