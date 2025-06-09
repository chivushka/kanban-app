export const ROUTER_KEYS = {
  ALL_MATCH: '/*',
  HOME: '/',
  BOARD: '/board/:id',
} as const;

export const QUERY_KEYS = Object.freeze({
  BOARD: 'BOARD',
  CARD: 'CARD',
});
