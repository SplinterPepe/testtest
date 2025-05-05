import { createSlice } from '@reduxjs/toolkit'

export const modalsSlice = createSlice({
    name: 'modalState',
    initialState: {
        isDeleteWarningModalOpen: false as boolean,
        isCreateUserModalOpen: false as boolean
    },
    reducers: {
        toggleDeleteWarningModal: (state) => {
            return {
                ...state,
                isDeleteWarningModalOpen: !state.isDeleteWarningModalOpen
            }

        },
        toggleCreateUserModal: (state) => {
            return {
                ...state,
                isCreateUserModalOpen: !state.isCreateUserModalOpen
            }
        }
    }
})

export const { toggleDeleteWarningModal, toggleCreateUserModal } = modalsSlice.actions

export const selectIsDeleteWarningModalOpen = state => state.modalState.isDeleteWarningModalOpen
export const selectIsCreateUserModalOpen = state => state.modalState.isCreateUserModalOpen

export default modalsSlice.reducer


