import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import { FilterParams } from 'types';
import querystring from 'query-string';
import { debounce, isArray, set } from 'lodash';

interface Props {
  onFetchData?: (filter: FilterParams) => void;
  defaultFilter?: FilterParams;
}

const initialFilter = {
  page: 1,
  limit: 10,
};

export const useFilter = ({
  onFetchData,
  defaultFilter = initialFilter,
}: Props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [filter, setFilter] = React.useState<FilterParams>(defaultFilter);

  const filterFromQuery = (query: any) => {
    let filterStatus = '';
    if (query?.status) {
      filterStatus = query.status;
    } else if (defaultFilter?.status) {
      filterStatus = defaultFilter?.status;
    } else {
      filterStatus = '';
    }
    const newFilter = {
      ...query,
      page: query.page ? +query.page : filter.page,
      limit: query.limit ? +query.limit : filter.limit,
      status: filterStatus,
    };
    if (query.sort) {
      set(
        newFilter,
        'orderBy',
        isArray(query.orderBy) ? query.orderBy : [query.orderBy],
      );
    }
    return newFilter;
  };

  React.useEffect(() => {
    const params = querystring.parse(location.search, {
      arrayFormat: 'bracket',
    });
    const newFilter: FilterParams = filterFromQuery(params);
    delete newFilter.id;
    delete newFilter.type;
    setFilter(newFilter);
    const handleFetchData = debounce(
      () => onFetchData?.call(null, newFilter),
      300,
    );
    handleFetchData();
    return () => handleFetchData.cancel();
  }, [location.search]);

  const onFilterToQueryString = (values: any): void => {
    navigate(
      {
        pathname: location.pathname,
        search: `?${querystring.stringify(
          {
            ...values,
            page: values.page > 0 ? values.page : 0,
          },
          { arrayFormat: 'bracket', skipNull: true, skipEmptyString: true },
        )}`,
      },
      { replace: true },
    );
  };

  return { filter, onFilterToQueryString };
};
