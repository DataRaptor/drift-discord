import { CSSProperties } from 'react'
import CircleLoader from 'react-spinners/CircleLoader'

const override: CSSProperties = {
      display: 'block',
      margin: '0 auto',
      borderColor: 'white',
}

export const LoadingSpinner = () => {
      return (
            <div>
                  <CircleLoader
                        color={'purple'}
                        cssOverride={override}
                        loading={true}
                        size={45}
                  />
                  <h1>Loading</h1>
            </div>
      )
}
