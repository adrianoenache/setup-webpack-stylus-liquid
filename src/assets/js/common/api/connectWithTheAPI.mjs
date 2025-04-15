async function connectWithTheAPI(urlAPI, optionsAPI, nameOfAPI = 'API') {

  let apiResult = '';
  let transformInJson = '';

  try {

    apiResult = await fetch(urlAPI, optionsAPI);
    transformInJson = await apiResult.json();

    if(transformInJson.erro) {

      throw Error(`Erro na conversção da ${nameOfAPI} para o formato JSON.`);

    }

    return transformInJson;

  } catch(erro) {

    console.error('Erro na consulta = ', erro);

  }

}

export default connectWithTheAPI
