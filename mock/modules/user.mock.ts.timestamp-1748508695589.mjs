// mock/modules/user.mock.ts
import { defineMock } from "vite-plugin-mock-dev-server/helper";

// mock/util.ts
var responseBody = {
  message: "",
  timestamp: 0,
  result: null,
  code: 0
};
function builder(data, message = "success", code = 0) {
  responseBody.result = data;
  if (message !== void 0 && message !== null)
    responseBody.message = message;
  if (code !== void 0 && code !== 0)
    responseBody.code = code;
  responseBody.timestamp = (/* @__PURE__ */ new Date()).getTime();
  return responseBody;
}

// mock/modules/user.mock.ts
var user_mock_default = defineMock([
  {
    url: "/api/auth/login",
    delay: 500,
    body: () => {
      return {
        code: 0,
        data: {
          token: "admin"
        },
        msg: "success"
      };
    }
  },
  {
    url: "/api/user/me",
    delay: 100,
    body: () => {
      return {
        code: 0,
        data: {
          uid: 1,
          name: "admin",
          avatar: "https://iconfont.alicdn.com/p/user/eZQFvSX6g8f1/f0d9fd95-a5f0-474d-98b0-d51e8450f2cf.png"
        },
        msg: "success"
      };
    }
  },
  {
    url: "/api/user/logout",
    delay: 500,
    body: () => {
      return {
        code: 0,
        msg: "success"
      };
    }
  },
  {
    url: "/api/user/email-code",
    delay: 1e3,
    body: () => {
      const code = "123456";
      return builder(code);
    }
  },
  {
    url: "/api/user/reset-password",
    delay: 1e3,
    body: () => {
      const res = true;
      return builder(res);
    }
  },
  {
    url: "/api/user/register",
    delay: 1e3,
    body: () => {
      const res = true;
      return builder(res);
    }
  }
]);
export {
  user_mock_default as default
};
