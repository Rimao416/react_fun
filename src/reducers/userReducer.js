const userReducer = (
  state = {
    users: null,
    loading: false,
    error: false,
  },
  action
) => {
  switch (action.type) {
    case "RETRIEVING_START":
      // console.log("Je me lance");
      return { ...state, loading: true, error: false };
    case "RETRIEVING_SUCCESS":
      // console.log("SALUT LES GARS");
      return { ...state, users: action.data, loading: false, error: false };
    case "RETRIEVING_FAIL":
      // console.log("object");
      return { ...state, users: false, error: true };
    default:
      return state;
  }
};
export default userReducer;
