export const removeQueryParamsFromRouter = (
  router: any,
  removeList: string[] = []
) => {
  if (removeList.length > 0) {
    removeList.forEach((param) => delete router.query[param])
  } else {
    Object.keys(router.query).forEach((param) => delete router.query[param])
  }
  router.replace(
    {
      pathname: router.pathname,
      query: router.query,
    },
    undefined,
    { shallow: true }
  )
}
