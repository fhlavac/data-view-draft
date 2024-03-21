import * as React from 'react';

// Hooks
const usePagginationUrl = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const state = useMemo(() => {
    return {
      perPage: 10
    }
  }, [location.search])

  const setLocationParams = ({perPage}) => navigate(...);
  return state
}

const useDataViewPagination = (initialConfig) => { 
  const [pagination, setPagination] = useState({
    page: 0,
    perPage: 10
  })

  const setPerPage = (perPage) => {
    setState(prev => ({...prev, perPage}))
  }

  const setPage = (page) => {
    setState(prev => ({...prev, page}))
  }

  return {
    ...state,
    setPerPage,
    setPage
  }
}

// Predefined bulk select component
const DataViewBulkSelect = ({ selected, onSelect }) => <div onSelect={onSelect}>BulkSelect implementation using PF Menu</div>;

// Predefined filter component
const DataViewFilters = ({ filters, filterValues, setFilters }) => filters.map((node) => {
  React.cloneElement(node, {onChange: (value) => setFilters(node.props.name, value), value: filterValues[node.props.name]})
});

// Predefined pagination component
const DataViewPagination = ({ pagination, setPage, setPerPage }) => (
  <Pagination
    itemCount={count}
    perPage={perPage}
    page={page}
    onSetPage={setPage}
    onSetPerPage={setPerPage}
  />
);

// Actions
const actions = [
  <DataViewAction onClick={() => console.log('first')} label="Primary action" />,
  <DataViewAction onClick={() => console.log('second')} label="Another action" />
];

// Predefined header component
const DataViewHeader = ({ pagination, filters, filterValues }) => {
  <Toolbar>
    <ToolbarItem>
      <DataViewBulkSelect />
    </ToolbarItem>
    <ToolbarItem>
      <DataViewFilters filters={filters} filterValues={filterValues} />
    </ToolbarItem>
    <ToolbarItem>
      <DataViewActions actions={actions} />
    </ToolbarItem>
    <ToolbarItem>
      <DataViewPagination pagination={pagination} />
    </ToolbarItem>
  </Toolbar>;
};

// Predefined footer component
const DataViewFooter = ({ page, perPage }) => <DataViewPagination page={page} perPage={perPage} isBottom />;

// Predefined expandable row component mapping rows to the PF expandable table implementation
const DataViewExpandableTableRow = ({ children, rows }) => {
  <tbody>
    {children}
    {rows.map((row, index) => (
      <tr key={index}>{row}</tr>
    ))}
  </tbody>;
};

// Predefined table component
const DataViewTable = () => {
  const context = React.useContext(DataViewContext);
  return (
    <div
      onClick={() => {
        context.setValues({ sortBy: 1, direction: 'ASC' });
      }}
    >
      Implementation using PF Table
    </div>
  );
};

// Checkbox filter example implementation
const ChexboxFilter = ({ title, onChange, name, value }) => <div onChange={() => onChange(name, ['foo'])}></div>;

/** DataView component
 * @param {header}
 * @param {footer}
 * @param {children} required
 */
const DataView = ({ children, props }) => React.cloneElement(children, {...props});

const MyPage = ({data, handleChange}) => {
  const { pagination, setPagination } = useDataViewPagination(initialValues);
  const { filterValues, setFilterValues } = useDataViewFilters(initialValues);
  const { selected, setSelected } = useDataViewSelection();

  React.useEffect(() => {
    handleChange(pagination, filterValues);
  }, [pagination, filterValues])

  return (
    <DataView
      isSelectable
      filterValues={filterValues}
      setFilterValues={setFilterValues}
      pagination={pagination}
      setPagination={setPagination}
      selected={selected}
      setSelected={setSelected}
      header={
        <DataViewHeader
          paginationVariant="compact"
          actions={actions}
          filters={[
              <CheckboxFilter name="state" title="State" options={[{id: 'active', label: 'Active'}]}/>,
              <TextFilter name="name" title="Name"/>,
          ]}
        />
      }
      footer={<DataViewFooter />}
    >
      <DataViewTable data={data} />
    </DataView>
  );
};


