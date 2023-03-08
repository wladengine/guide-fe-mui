import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import {
    DataGrid,
    ruRU,
    gridClasses,
    GridToolbarContainer,
    GridActionsCellItem,
} from '@mui/x-data-grid';
import {Stack} from "@mui/material";

function EditToolbar(props) {
    const { handleClick } = props
    return <GridToolbarContainer>
        <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
            Добавить новую запись
        </Button>
    </GridToolbarContainer>;
}

EditToolbar.propTypes = {
    handleClick: PropTypes.func.isRequired,
};

export default function CrudDataGrid({ columns, rows, useActionsColumn = true, onCreateNewRecordHandler, onEditRecordHandler, onDeleteRecordHandler }) {
    const [rowModesModel, setRowModesModel] = React.useState({});

    const handleEditClick = (id) => () => {
        onEditRecordHandler(id);
    };
    const handleDeleteClick = (id) => () => {
        onDeleteRecordHandler(id);
    };

    const actionsColumn = {
        field: 'actions',
        type: 'actions',
        headerName: 'Действия',
        width: 100,
        cellClassName: 'actions',
        getActions: ({ id }) => {
            return [
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Редактировать"
                    className="textPrimary"
                    onClick={handleEditClick(id)}
                    color="inherit"
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Удалить"
                    onClick={handleDeleteClick(id)}
                    color="inherit"
                />,
            ];
        },
    }

    if (useActionsColumn) {
        columns.push(actionsColumn)
    }

    return (
        <Box
            sx={{
                width: '100%',
                '& .actions': {
                    color: 'text.secondary',
                },
                '& .textPrimary': {
                    color: 'text.primary',
                },
            }}
        >
            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                <DataGrid
                    localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
                    disableRowSelectionOnClick
                    autoHeight
                    getRowHeight={() => 'auto'}
                    sx={{
                        [`& .${gridClasses.cell}`]: {
                            py: 1,
                        },
                    }}
                    rows={rows}
                    columns={columns}
                    editMode="row"
                    rowModesModel={rowModesModel}
                    slots={{
                        toolbar: EditToolbar
                    }}
                    slotProps={{
                        toolbar: { handleClick: onCreateNewRecordHandler },
                    }}
                />
            </Stack>

        </Box>
    );
}