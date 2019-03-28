require('dotenv').config()
const axios = require('axios')
const mysql = require('mysql')
var connection = mysql.createConnection({
    host: process.env.HOST,
    user: 'root',
    password: process.env.SECRET,
    database: process.env.DATABSE
})
const delay = ms => {
    return new Promise(resolve => setTimeout(resolve, ms))
}
const count = length => Array.from({ length })
const gtaSerieJ = count(3).map((_, index) => ({ numeroGta: index + 1, serieGta: 'J' }))
const gtaExt = async function () {
    for (const item of gtaSerieJ) {
        delay(1000)
        const result = await axios.post(
            'https://siapec3.adepara.pa.gov.br/siapec3/services/rest/gta/consultarGtaPorNumeroSerie/',
            { "numeroGta": item.numeroGta, "serieGta": item.serieGta, }).then(outPut => (outPut.data.gta))
        if (result == undefined) {
            console.log(`GTA ${item.serieGta} - ${item.numeroGta} Inválida!`)
        } else {
            result.map(e => {
                const animais = e.animais.map(row => {
                    return {
                        ...row,
                        nrGta: e.nrGta,
                        dsSerie: e.dsSerie
                    }
                })
                animais.map(async linha => {
                    await connection.query(`INSERT INTO gta_siape_3.ext (nrGta, nomeEstratificacao, nomeEstratificacaoSimplificada, quantidadeAnimais, dsSerie) VALUES ('${linha.nrGta}', '${linha.nomeEstratificacao}', '${linha.nomeEstratificacaoSimplificada}', '${linha.quantidadeAnimais}', '${linha.dsSerie}')`, function (err, returned, fields) {
                        if (err) throw err;
                        console.log(`Adicionou os Animais GTA ${linha.nrGta} no banco!`);
                        if (fields) {
                            console.log('Fim!')
                        }
                    })

                })
            })
        }
    }
}
gtaExt()
