import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { AppDispatch } from '../../state'
import { ApplicationModal, setOpenModal } from '../../state/application/actions'

// Redirects to swap but only replace the pathname
export function RedirectPathToTransferOnly({ location }: RouteComponentProps) {
  return <Redirect to={{ ...location, pathname: '/transfer' }} />
}

// Redirects from the /transfer/:outputCurrency path to the /transfer?outputCurrency=:outputCurrency format
export function RedirectToTransfer(props: RouteComponentProps<{ outputCurrency: string }>) {
  const {
    location: { search },
    match: {
      params: { outputCurrency }
    }
  } = props

  return (
    <Redirect
      to={{
        ...props.location,
        pathname: '/transfer',
        search:
          search && search.length > 1
            ? `${search}`
            : `?outputCurrency=${outputCurrency}`
      }}
    />
  )
}

export function OpenClaimAddressModalAndRedirectToTransfer(props: RouteComponentProps) {
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    dispatch(setOpenModal(ApplicationModal.ADDRESS_CLAIM))
  }, [dispatch])
  return <RedirectPathToTransferOnly {...props} />
}
