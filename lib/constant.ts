type RespResult = {
  status: number
  msg: string
}

type PayloadResult<T> = RespResult & {
  payload: T
}
const OKResult: RespResult = {
  status: 200,
  msg: 'OK',
}

const FailResult: RespResult = {
  status: 500,
  msg: 'Internal Service Error',
}

const TimeOutResult: RespResult = {
  status: 408,
  msg: 'REQUEST TIME OUT',
}

const NotfoundResult: RespResult = {
  status: 404,
  msg: 'NOT FOUND',
}

const ConflictResult: RespResult = {
  status: 409,
  msg: 'CONFLICT',
}

const PayloadRespResult = <T>(payload: T): PayloadResult<T> => {
  return {
    status: 200,
    msg: 'OK',
    payload,
  }
}

export {
  OKResult,
  FailResult,
  NotfoundResult,
  ConflictResult,
  TimeOutResult,
  PayloadRespResult,
}
