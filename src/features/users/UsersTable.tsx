import { useDispatch, useSelector } from 'react-redux'
import { selectUsers, deleteUser } from './usersSlice'
import { useReactTable, getCoreRowModel, flexRender, getSortedRowModel, getFilteredRowModel, RowData, ColumnFiltersState, ColumnDef, Column, SortingState } from "@tanstack/react-table"
import React from 'react'
import styled from 'styled-components'
import { Button, Modal } from 'react-bootstrap'
import { selectIsDeleteWarningModalOpen, toggleCreateUserModal, toggleDeleteWarningModal } from '../modals/modalsSlice'

export const UsersTable = () => {
  const data = useSelector(selectUsers)
  const dispatch = useDispatch()

  const [rowSelection, setRowSelection] = React.useState({})
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  const columns = React.useMemo<ColumnDef<String, any>[]>(
    () => [
      {
        id: 'select',
        cell: ({ row }) => (
          <input
            type="checkbox"
            style={{ cursor: 'pointer' }}
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
      },
      {
        header: "ID",
        accessorKey: "id",
        enableColumnFilter: false
      },
      {
        header: "Имя",
        accessorKey: "name"
      },
      {
        header: "Имя пользователя",
        accessorKey: "username",
        enableSorting: false,
        enableColumnFilter: false
      },
      {
        header: "Email",
        accessorKey: "email",
        enableSorting: false
      },
      {
        header: "Phone",
        accessorKey: "phone",
        enableSorting: false
      },
      {
        header: "Почтовый индекс",
        accessorKey: "address.zipcode",
        enableColumnFilter: false
      }
    ], []
  )

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
      columnFilters,
      rowSelection
    },
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: true,

  })

  return (
    <TablePageStyled>
      <TableButtonPanelStyled>
        <Button
          disabled={Object.keys(table.getState().rowSelection).length === 0}
          onClick={() => {
            dispatch(toggleDeleteWarningModal())
          }}
        >
          Удалить
        </Button>

        <Button
          onClick={() => {
            dispatch(toggleCreateUserModal())
          }}
          style={{ margin: '0 5px' }}
        >
          Добавить
        </Button>
      </TableButtonPanelStyled>
      <TableContainerStyled>
        <TableStyled>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            style={{ cursor: header.column.getCanSort() ? 'pointer' : '' }}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: '▲',
                              desc: '▼',
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                          {header.column.getCanFilter() ? (
                            <div>
                              <Filter column={header.column} />
                            </div>
                          ) : null}
                        </>
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </TableStyled>
        <Modal
          show={useSelector(selectIsDeleteWarningModalOpen)}
        >
          <Modal.Header>
            <Modal.Title>Вы точно хотите удалить выбранных пользователей?</Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <Button
              onClick={() => {
                let idsForDelete = Object.keys(table.getState().rowSelection).map((str) => Number(str))
                dispatch(deleteUser(idsForDelete))
                setRowSelection({})
                dispatch(toggleDeleteWarningModal())
              }}
            >
              Удалить
            </Button>

            <Button onClick={() => dispatch(toggleDeleteWarningModal())}>Отмена</Button>
          </Modal.Footer>
        </Modal>
      </TableContainerStyled>
    </TablePageStyled >
  )
}

function Filter({ column }: { column: Column<any, unknown> }) {
  const columnFilterValue = column.getFilterValue()

  return (
    <DebouncedInput
      onChange={value => column.setFilterValue(value)}
      placeholder={`Фильтр...`}
      type="text"
      value={(columnFilterValue ?? '') as string}
    />
  )
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = React.useState(initialValue)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <input {...props} value={value} onChange={e => setValue(e.target.value)} />
  )
}

const TablePageStyled = styled.div`
    display: flex;
    flex-direction: column;
    margin: 5px;
`

const TableContainerStyled = styled.div`
    border: 1px solid #e7e7e7;
    display: flex;
    flex-direction: row;
    box-shadow: 8px 8px 5px 8px lightblue;
    font-size: 18px;
    width: 
`
const TableStyled = styled.table`
  text-align: center;
  background-color: white;
  > * {
    &:first-child {
      th, td {
        padding: 20px;
      }
      background-color: #ebf8f8;
    }
  }
`

const TableButtonPanelStyled = styled.div`
    display: flex;
    flex-direction: row-reverse;
    padding: 5px;
`