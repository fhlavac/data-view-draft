import { Td, Tr } from '@patternfly/react-table';
import * as React from 'react';

const DataViewContext = React.createContext({
  setValues: () => undefined,
  page: 1,
  perPage: 25,
  filters: {},
  activeFilters: [],
  data: [],
  parseConfig: () => {},
  setConfig: () => undefined,
  fetchData: () => Promise.resolve(),
});

/** DataView component
 * @param {children} required
 * @param {fetchData} optional
 */
const DataView = ({ children, fetchData }) => {
  const [values, setValues] = React.useState({
    page: 1,
    perPage: 25,
    filets: {},
    activeFilters: [],
    data: [],
    fetchData,
  });

  const debouncedFetch = () => {};

  const onSetValues = React.useCallback((values) => {
    if (values.filterBy) {
      debouncedFetch();
    } else {
      fetchData();
    }
    setValues(values);
  }, []);

  <DataViewContext.Provider value={{ ...values, setValues: onSetValues }}>{children}</DataViewContext.Provider>;
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

// Predefined pagination component
const DataViewPagination = () => {
  const DataViewContext = React.useContext(DataViewContext);
  React.useEffect(() => {
    const { page, perPage } = DataViewContext.parseConfig();
    // setting initial values
    DataViewContext.setValues({
      page,
      perPage,
    });
  }, [DataViewContext]);
  return (
    <Pagination
      itemCount={count}
      perPage={perPage}
      page={page}
      onSetPage={onSetPage}
      onPerPageSelect={(page) => DataViewContext.setValues({ page })}
    />
  );
};

// Predefined filters component
const DataViewFilters = ({ isQueryManaged }) => <div>Filters implementation using PF</div>;

// Predefined bulk select component
const DataViewBulkSelect = () => <div onSelect={() => null}>BulkSelect implementation using PF Menu</div>;

// Predefined text filter util function
const createTextFilter = (name, title, value) => ({
  type: 'text',
  name,
  title,
  value,
});

// Predefined checkbox filter util function
const createCheckboxFilter = (name, title, value, options) => ({
  type: 'checkbox',
  name,
  title,
  value,
  options,
});

// Predefined expandable row component mapping rows to the PF expandable table implementation
const DataViewExpandableTableRow = ({ children, rows }) => {
  <tbody>
    {children}
    {rows.map((row, index) => (
      <tr key={index}>{row}</tr>
    ))}
  </tbody>;
};

// User defined top panel component
const DataViewTopPanel = ({ page, perPage, filters, isQueryManaged }) => {
  <Toolbar>
    <ToolbarItem>
      <DataViewBulkSelect />
    </ToolbarItem>
    <ToolbarItem>
      <DataViewFilters filters={filters} isQueryManaged={isQueryManaged} />
    </ToolbarItem>
    <ToolbarItem>
      <DataViewPagination page={page} perPage={perPage} />
    </ToolbarItem>
  </Toolbar>;
};

// User defined bottom panel component
const DataViewBottomPanel = ({ page, perPage }) => <DataViewPagination page={page} perPage={perPage} isBottom />;

// Example page defined by consumer of the DataView
const MyPage = () => {
  const page = useSelector(({ meta }) => meta.page);
  const location = useLocation();
  return (
    <DataView
      parseConfig={() => location.search}
      setConfig={(config) => location.setParams(config)}
      fetchData={({ pagination, sortBy }) => {
        someAsync(pagination);
      }}
      topPanel={
        <DataViewTopPanel
          filters={{
            values: [
              createTextFilter('some title', 'some name', 'initial value'),
              {
                type: 'text',
                name: 'input2',
                title: 'Second input',
                value: '',
              },
              createCheckboxFilter('name', 'title', undefined, [
                {
                  value: 'option1',
                  title: 'First option',
                },
              ]),
              {
                type: 'checkbox',
                name: 'check2',
                title: 'Manual checkbox filter',
                value: ['foo'],
                options: [
                  {
                    value: 'foo',
                    title: 'Exmaple option',
                  },
                ],
              },
            ],
          }}
        />
      }
      bottomPanel={<DataViewBottomPanel page={page} perPage="25" />}
    >
      <DataViewTable>
        <DataViewTableHeader>
          <DataViewTableRowHead cells={['one']} />
        </DataViewTableHeader>
        <DataViewTableRows>
          <DataViewExpandableTableRow
            key="one"
            rows={[
              <Tr key="one">
                <Td>one</Td>
              </Tr>,
              <Tr key="two">
                <Td>one</Td>
              </Tr>,
            ]}
          >
            <Tr>
              <Td>one</Td>
            </Tr>
          </DataViewExpandableTableRow>
          <Tr>
            <Td>one</Td>
          </Tr>
        </DataViewTableRows>
      </DataViewTable>
    </DataView>
  );
};
