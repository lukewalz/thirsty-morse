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

})
export default theme