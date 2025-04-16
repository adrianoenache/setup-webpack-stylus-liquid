function resolveApiPromise(apiPromise, doThisActionOnSuccess, errorMessage = 'Erro na API', doThisActionOnFail = false) {

  apiPromise.then((data) => {

    if(!data) {

      console.warn(errorMessage)

      if(typeof (doThisActionOnFail) == 'function') doThisActionOnFail()

      return

    }

    doThisActionOnSuccess(data)

  })

}

export default resolveApiPromise
