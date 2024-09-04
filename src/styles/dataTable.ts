export const customStyles = {
    tableWrapper: {
        style: {
            display: 'block',
        },
    },
    headRow: {
        style: {
            border: 'none',
        },
    },
    head: {
        style: {
            fontSize: '16px',
            fontWeight: 500,
        },
    },
    headCells: {
        style: {
            color: '#202124',
            fontSize: '16px',
        },
    },
    rows: {
        style: {
            fontSize: '16px',
            fontWeight: 400,
            minHeight: '48px',
            '&:not(:last-of-type)': {
                borderBottomStyle: 'solid',
                borderBottomWidth: '1px',
            },
        },
        highlightOnHoverStyle: {
            backgroundColor: 'rgba(158, 158, 158, 0.2)',
            borderBottomColor: '#FFFFFF',
            outline: '1px solid #FFFFFF',
        },
    },
    pagination: {
        style: {
            border: 'none',
        },
        pageButtonsStyle: {
            height: '40px',
            width: '40px',
            padding: 'px',
            margin: '4px',
            '&#pagination-last-page,&#pagination-first-page': {
                display: 'none'
            }
        }
    },
} as import("react-data-table-component").TableStyles;