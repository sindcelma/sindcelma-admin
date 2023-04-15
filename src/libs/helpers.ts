
export default {
    dateToBr: (data:string) => {
        let dat = new Date(data)
        let mes:string|number = dat.getMonth()+1
        mes = mes < 10 ? `0${mes}` : mes;
        return `${dat.getDate()}/${mes}/${dat.getFullYear()}`
    },

    brToDate: (data:string) => {
        let dat = data.split('/')
        return `${dat[2]}-${dat[1]}-${dat[0]}`
    }
}