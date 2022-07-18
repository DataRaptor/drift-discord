import { CSSProperties } from 'react'
import RingLoader from 'react-spinners/RingLoader'

const override: CSSProperties = {
      display: 'block',
      margin: '0 auto',
      borderColor: 'white',
}

export const LoadingSpinner = () => {
      return (
            <div>
                  <RingLoader
                        color={'purple'}
                        cssOverride={override}
                        loading={true}
                        size={45}
                  />
            </div>
      )
}
