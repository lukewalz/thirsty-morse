import { createMuiTheme } from '@material-ui/core/styles'

const theme = createMuiTheme({

    palette: {
        primary: {
            main: '#8bc34a',
            contrastText: '#fff',
        },
        secondary: {
            main: '#f6f6f6',
            contrastText: '#8bc34a',
        },
        info: {
            main: '#ffa726',
            contrastText: '#8bc34a',
        },

    },

    props: {
        MuiTextField: {
            margin: 'dense',
            variant: 'outlined'
        },
        MuiPaper: {
            style: {
                margin: 5,
                padding: 5
            }
        },
        MuiTableContainer: {
            style: {
                margin: 0,
                padding: 0
            }
        },
        MuiGrid: {
            height: 100,
            alignItems: "center",
        },
        MuiList: {
            disablePadding: true,

        },
        MuiAppBar: {
            style: {
                margin: 0,
                padding: 0
            }
        }
    }

})
export default theme