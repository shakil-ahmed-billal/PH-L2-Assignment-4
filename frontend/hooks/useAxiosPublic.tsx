"use client";

import axios from "axios";

/**
 * Axios instance for public API calls
 * Use this for unauthenticated requests
 */
const axiosPublic = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;