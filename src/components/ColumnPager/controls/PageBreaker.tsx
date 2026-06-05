const PageBreaker = (props?: { changeColumnCountTo?: number }) => {
  return <div data-page-breaker data-change-column-count-to={props?.changeColumnCountTo} />;
};

export default PageBreaker;
