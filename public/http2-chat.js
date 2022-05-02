window.http2GetMessages = async () => {
  let reader, result
  const utf8Decoder = new TextDecoder('utf-8')
  let onlineStatus = false
  try {
    const res = await fetch('/api/messages')
    reader = res.body?.getReader()
  } catch (e) {
    console.error('connection err', e)
  }
  let done
  onlineStatus = true
  do {
    let readerResponse
    try {
      readerResponse = await reader?.read()
    } catch (e) {
      console.error('reader failed', e)
      onlineStatus = false
      return
    }
    done = readerResponse?.done
    const chunk = utf8Decoder.decode(readerResponse?.value, { stream: true })
    if (chunk) {
      try {
        const json = JSON.parse(chunk)
        result = json
      } catch (e) {
        console.error('parse error', e)
      }
    }
    console.log('done', done)
  } while (done === false)
  return result
}
