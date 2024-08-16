export class BaseAnalytics {
}
let _analytics;
export function setAnalytics(analytics) {
    _analytics = Object.freeze(analytics);
}
export const Analytics = {
    event: (options)=>_analytics?.event(options)
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcY2Vsc2lcXERvY3VtZW50c1xcUHJvZ3JhbW1pbmdcXFdvcmtcXHJvYm8uanNcXHBhY2thZ2VzXFxwbHVnaW4tYW5hbHl0aWNzXFxzcmNcXHV0aWxzXFxhbmFseXRpY3MudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGludGVyZmFjZSBFdmVudE9wdGlvbnMge1xyXG5cdGNhdGVnb3J5Pzogc3RyaW5nXHJcblx0bGFiZWw/OiBzdHJpbmdcclxuXHRudW1iZXJPZkV4ZWN1dGlvbj86IG51bWJlclxyXG5cdHVzZXI/OiB1c2VyRGF0YVxyXG5cdGlkPzogbnVtYmVyIHwgc3RyaW5nXHJcbn1cclxuXHJcbmludGVyZmFjZSB1c2VyRGF0YSB7XHJcblx0bmFtZT86IHN0cmluZ1xyXG5cdGlkPzogc3RyaW5nIHwgbnVtYmVyXHJcblx0ZW1haWw/OiBzdHJpbmdcclxufVxyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEJhc2VBbmFseXRpY3Mge1xyXG5cdGFic3RyYWN0IGV2ZW50KG9wdGlvbnM6IEV2ZW50T3B0aW9ucyk6IFByb21pc2U8dm9pZD5cclxufVxyXG5cclxubGV0IF9hbmFseXRpY3M6IEJhc2VBbmFseXRpY3NcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRBbmFseXRpY3MoYW5hbHl0aWNzOiBCYXNlQW5hbHl0aWNzKSB7XHJcblx0X2FuYWx5dGljcyA9IE9iamVjdC5mcmVlemUoYW5hbHl0aWNzKVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgQW5hbHl0aWNzID0ge1xyXG5cdGV2ZW50OiAob3B0aW9uczogRXZlbnRPcHRpb25zKSA9PiBfYW5hbHl0aWNzPy5ldmVudChvcHRpb25zKVxyXG59XHJcbiJdLCJuYW1lcyI6WyJCYXNlQW5hbHl0aWNzIiwiX2FuYWx5dGljcyIsInNldEFuYWx5dGljcyIsImFuYWx5dGljcyIsIk9iamVjdCIsImZyZWV6ZSIsIkFuYWx5dGljcyIsImV2ZW50Iiwib3B0aW9ucyJdLCJtYXBwaW5ncyI6IkFBY0EsT0FBTyxNQUFlQTtBQUV0QjtBQUVBLElBQUlDO0FBRUosT0FBTyxTQUFTQyxhQUFhQyxTQUF3QjtJQUNwREYsYUFBYUcsT0FBT0MsTUFBTSxDQUFDRjtBQUM1QjtBQUVBLE9BQU8sTUFBTUcsWUFBWTtJQUN4QkMsT0FBTyxDQUFDQyxVQUEwQlAsWUFBWU0sTUFBTUM7QUFDckQsRUFBQyJ9