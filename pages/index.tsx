import type {  NextPage } from 'next'

import styles from '../styles/Home.module.css'
import CampaingFactory from '../ethereum/factory'
import { useEffect, useState } from 'react'

type HomeProps = {
  campaigns?: string[]
}
const Home: NextPage<HomeProps> = () => {
  const [campaigns, setCampaigns] = useState<string[]>()

  async function _setCampaigns() {
    const getContracts = await CampaingFactory.methods.getContracts()
    const campaigns = await getContracts.call().catch(console.error)
    setCampaigns(campaigns)
  }

  useEffect(()=>{
    _setCampaigns()
  }, [])

  return (
    <div className={styles.container}>
      <ul>
        {campaigns && campaigns.map(camp => <li key={camp}>{camp}</li>)}
      </ul>
    </div>
  )
}

// export const getServerSideProps = async (): Promise<{props: HomeProps}> => {
//   const getContracts = await CampaingFactory.methods.getContracts()
//   const campaigns = (await getContracts.call().catch(console.error)) || null
//   return {props: {campaigns}}
// }

export default Home
