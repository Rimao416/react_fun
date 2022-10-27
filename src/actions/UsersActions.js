import * as UserApi from "../api/UserRequest";
export const getAllPosts = () => async (dispatch) => {
  dispatch({ type: "RETRIEVING_START" });
  console.log("STARTT");
  try {
    // const { data } = await UserApi.getAllPosts();
    const {data} = await UserApi.getAllPosts();
    console.log(data);
    dispatch({ type: "RETRIEVING_SUCCESS", data });
  } catch (error) {
    dispatch({ type: "RETRIEVING_FAIL" });
    console.log(error);
  }
};
