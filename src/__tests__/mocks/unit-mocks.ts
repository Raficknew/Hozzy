import type { Mock } from "vitest";

type ViLike = {
  fn: (...args: unknown[]) => Mock;
};

export function createServerActionMocks(vi: ViLike) {
  return {
    headersMock: vi.fn(),
    getTranslationsMock: vi.fn(),
    revalidatePathMock: vi.fn(),
    redirectMock: vi.fn(),
    validateUuidMock: vi.fn(),
    getSessionMock: vi.fn(),
    safeParseMock: vi.fn(),
  };
}

export function applyServerActionDefaults(
  mocks: ReturnType<typeof createServerActionMocks>,
  session: unknown = { user: { id: "user-1" } },
) {
  mocks.headersMock.mockResolvedValue({});
  mocks.getTranslationsMock.mockResolvedValue((key: string) => key);
  mocks.getSessionMock.mockResolvedValue(session);
  mocks.validateUuidMock.mockReturnValue(true);
}

export function createCategoryPermissionMocks(vi: ViLike) {
  const selectMock = vi.fn();
  const fromMock = vi.fn();
  const whereMock = vi.fn();
  const countMock = vi.fn();
  const eqMock = vi.fn();

  return {
    selectMock,
    fromMock,
    whereMock,
    countMock,
    eqMock,
    dbMock: {
      select: selectMock,
    },
  };
}

export function applyCategoryPermissionDefaults(
  mocks: ReturnType<typeof createCategoryPermissionMocks>,
) {
  mocks.selectMock.mockReturnValue({ from: mocks.fromMock });
  mocks.fromMock.mockReturnValue({ where: mocks.whereMock });
  mocks.whereMock.mockResolvedValue([{ count: 0 }]);
  mocks.countMock.mockReturnValue("count-function");
  mocks.eqMock.mockReturnValue("eq-condition");
}

export function createHouseholdPermissionMocks(vi: ViLike) {
  const selectMock = vi.fn();
  const fromMock = vi.fn();
  const whereMock = vi.fn();
  const countMock = vi.fn();
  const eqMock = vi.fn();
  const andMock = vi.fn();
  const getSessionMock = vi.fn();
  const getHouseholdMock = vi.fn();
  const headersMock = vi.fn();
  const householdFindFirstMock = vi.fn();
  const membersFindFirstMock = vi.fn();

  return {
    selectMock,
    fromMock,
    whereMock,
    countMock,
    eqMock,
    andMock,
    getSessionMock,
    getHouseholdMock,
    headersMock,
    householdFindFirstMock,
    membersFindFirstMock,
    dbMock: {
      select: selectMock,
      query: {
        HouseholdTable: {
          findFirst: householdFindFirstMock,
        },
        MembersTable: {
          findFirst: membersFindFirstMock,
        },
      },
    },
    authMock: {
      api: {
        getSession: getSessionMock,
      },
    },
  };
}

export function applyHouseholdPermissionDefaults(
  mocks: ReturnType<typeof createHouseholdPermissionMocks>,
) {
  mocks.selectMock.mockReturnValue({ from: mocks.fromMock });
  mocks.fromMock.mockReturnValue({ where: mocks.whereMock });
  mocks.whereMock.mockResolvedValue([{ count: 0 }]);
  mocks.countMock.mockReturnValue("count-function");
  mocks.eqMock.mockReturnValue("eq-condition");
  mocks.andMock.mockReturnValue("and-condition");
}

export function createMembersPermissionMocks(vi: ViLike) {
  const getSessionMock = vi.fn();
  const getHouseholdMock = vi.fn();
  const headersMock = vi.fn();

  return {
    getSessionMock,
    getHouseholdMock,
    headersMock,
    authMock: {
      api: {
        getSession: getSessionMock,
      },
    },
  };
}

export function applyMembersPermissionDefaults(
  mocks: ReturnType<typeof createMembersPermissionMocks>,
) {
  mocks.headersMock.mockResolvedValue({});
}

export function createRateLimitMocks(vi: ViLike) {
  const limitMock = vi.fn();
  const slidingWindowMock = vi.fn();
  const redisFromEnvMock = vi.fn();
  const redisClientMock = { type: "mock-redis" };
  const limiterConfigMock = { type: "sliding-window-config" };

  const RatelimitMock = vi.fn().mockImplementation(function (this: {
    limit: typeof limitMock;
  }) {
    this.limit = limitMock;
  });

  Object.assign(RatelimitMock, {
    slidingWindow: slidingWindowMock,
  });

  return {
    limitMock,
    slidingWindowMock,
    redisFromEnvMock,
    redisClientMock,
    limiterConfigMock,
    RatelimitMock,
  };
}

export function applyRateLimitDefaults(
  mocks: ReturnType<typeof createRateLimitMocks>,
) {
  mocks.limitMock.mockReset();
  mocks.limitMock.mockResolvedValue({ remaining: 1 });

  mocks.slidingWindowMock.mockReset();
  mocks.slidingWindowMock.mockReturnValue(mocks.limiterConfigMock);

  mocks.redisFromEnvMock.mockReset();
  mocks.redisFromEnvMock.mockReturnValue(mocks.redisClientMock);

  mocks.RatelimitMock.mockClear();
}

export function createUuidMocks(vi: ViLike, value = "mocked-uuid-1234") {
  return {
    v4Mock: vi.fn(() => value),
  };
}

type DbOperatorMocks = {
  eqMock: Mock;
  andMock?: Mock;
};

export function applyDbOperatorDefaults(mocks: DbOperatorMocks) {
  mocks.eqMock.mockReturnValue("eq-condition");
  mocks.andMock?.mockReturnValue("and-condition");
}

type CrudChainMocks = {
  insertMock: Mock;
  updateMock: Mock;
  deleteMock: Mock;
  valuesMock: Mock;
  setMock: Mock;
  whereMock: Mock;
  returningMock: Mock;
};

export function applyCrudChainDefaults(
  mocks: CrudChainMocks,
  returningValue: unknown,
) {
  mocks.insertMock.mockReturnValue({ values: mocks.valuesMock });
  mocks.valuesMock.mockReturnValue({ returning: mocks.returningMock });

  mocks.updateMock.mockReturnValue({ set: mocks.setMock });
  mocks.setMock.mockReturnValue({ where: mocks.whereMock });

  mocks.deleteMock.mockReturnValue({ where: mocks.whereMock });
  mocks.whereMock.mockReturnValue({ returning: mocks.returningMock });

  mocks.returningMock.mockResolvedValue(returningValue);
}
