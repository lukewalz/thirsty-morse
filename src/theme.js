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
    },

    props: {
        MuiTextField: {
            margin: 'dense',
            variant: 'outlined'
        },
        MuiPaper: {
            style: {
                margin: 20,
                padding: 20
            }
        },
        MuiGrid: {

            alignItems: "center",
            spacing: 2
        }
    }

})
export default theme