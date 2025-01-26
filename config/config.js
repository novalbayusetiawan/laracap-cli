import Conf from "conf";

export const config = new Conf({
  projectName: "laracap",
  defaults: {
    token: null,
    apiUrl: "http://laracap-live-update.test/api",
  },
});
