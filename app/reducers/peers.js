import { createSelector } from 'reselect'
import { callApi } from '../api'
// ------------------------------------
// Constants
// ------------------------------------
export const SET_PEER_FORM = 'SET_PEER_FORM'

export const SET_PEER = 'SET_PEER'

export const GET_PEERS = 'GET_PEERS'
export const RECEIVE_PEERS = 'RECEIVE_PEERS'

// ------------------------------------
// Actions
// ------------------------------------
export function setPeerForm(isOpen) {
  return {
    type: SET_PEER_FORM,
    isOpen
  }
}

export function setPeer(peer) {
  return {
    type: SET_PEER,
    peer
  }
}

export function getPeers() {
  return {
    type: GET_PEERS
  }
}

export function receivePeers({ peers }) {
  return {
    type: RECEIVE_PEERS,
    peers
  }
}

export const fetchPeers = () => async (dispatch) => {
  dispatch(getPeers())
  const peers = await callApi('peers')
  dispatch(receivePeers(peers.data))
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_PEER_FORM]: (state, { isOpen }) => ({ ...state, peerForm: { ...state.form, isOpen } }),

  [SET_PEER]: (state, { peer }) => ({ ...state, peer }),

  [GET_PEERS]: (state) => ({ ...state, peersLoading: true }),
  [RECEIVE_PEERS]: (state, { peers }) => ({ ...state, peersLoading: false, peers })
}

const peersSelectors = {}
const peerSelector = state => state.peers.peer

peersSelectors.peerModalOpen = createSelector(
  peerSelector,
  peer => peer ? true : false
)

export { peersSelectors }

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  peersLoading: false,
  peers: [],
  peer: null,
  peerForm: {
    isOpen: false,
    pub_key: '',
    address: ''
  }
}

export default function peersReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}