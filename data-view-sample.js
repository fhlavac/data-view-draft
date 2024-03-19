import { Td, Tr } from '@patternfly/react-table';
import * as React from 'react';

// Hooks
const usePagginationUrl = () => {
  const navigate = useNaviaget()
  const location = useLocation()
  const state = useMemo(() => {
    return {
      perPage: 10
    }
  }, [location.search])

  const setLocationParams = ({perPage}) => {
    navigate(...);
  }

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

// Predefined top panel component
const DataViewTopPanel = ({ pagination, filters, filterValues }) => {
  <Toolbar>
    <ToolbarItem>
      <DataViewBulkSelect />
    </ToolbarItem>
    <ToolbarItem>
      <DataViewFilters filters={filters} filterValues={filterValues} />
    </ToolbarItem>
    <ToolbarItem>
      <DataViewPagination pagination={pagination} />
    </ToolbarItem>
  </Toolbar>;
};

// User defined bottom panel component
const DataViewBottomPanel = ({ page, perPage }) => <DataViewPagination page={page} perPage={perPage} isBottom />;

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
 * @param {topPanel}
 * @param {bottomPanel}
 * @param {children} required
 */
const DataView = ({ children, props }) => React.cloneElement(children, {...props});

const MyPage = () => {
  const { data, setData } = useState();
  const { pagination, setPagination } = useDataViewPagination(initialValues);
  const { filterValues, setFilterValues } = useDataViewFilters(initialValues);
  const { selected, setSelected } = useDataViewSelection();

  React.useEffect(() => {
    // fetch data here
    setData(fetchedData);
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
      topPanel={
        <DataViewTopPanel
          paginationVariant="compact"
          actions={actionsDefinition}
          filters={[
              <CheckboxFilter name="state" title="State" options={[{id: 'active', label: 'Active'}]}/>,
              <TextFilter name="name" title="Name"/>,
          ]}
        />
      }
      bottomPanel={<DataViewBottomPanel />}
    >
      <DataViewTable>
        <DataViewTableHeader>
            <DataViewTableRowHead cells={['one']} />
          </DataViewTableHeader>
          <DataViewTableRows>
            {data.map((item) =>
              <DataViewExpandableTableRow 
                key={item.id} 
                rows={
                  item.subitems.map((subitem) => (
                    <Tr key={subitem.id}>
                      <Td>{subitem.name}</Td>
                    </Tr>
                  ))
                }
              >
                <Td>{item.name}</Td>
              </DataViewExpandableTableRow>
            )}
            <Tr>
              <Td>Last not expandable row added manually</Td>
            </Tr>          
          </DataViewTableRows>
      </DataViewTable>
    </DataView>
  );
};


