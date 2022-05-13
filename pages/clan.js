import React from 'react'
import { supabase } from '../client'
import Link from 'next/link'

import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchAllProfiles } from '../store/features/houseProfiles'

const clan = ({ session }) => {
  let { singleHouseholdProfiles } = useSelector((store) => store)
  let [profiles, loading] = [
    singleHouseholdProfiles.entities,
    singleHouseholdProfiles.loading,
  ]
  let [householdName, setHouseholdName] = useState('')
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchAllProfiles())
    getHouseholdInfo()
  }, [])

  // create async function to get info from household_table
  const getHouseholdInfo = async () => {
    const user = supabase.auth.user()
    try {
      let { data: userID } = await supabase
        .from('profiles')
        .select(`*`)
        .eq('id', user.id)
        .single()
      let { data: household } = await supabase
        .from('household_table')
        .select(`*`)
        .eq('id', userID.household_id)
        .single()
      console.log(userID, 'this is user')
      console.log(household, 'this is household')
      setHouseholdName(household.name)
      return household
    } catch (error) {
      console.log(error)
      return error
    }
  }

  console.log(profiles, 'this is profiles from clan page')
  return (
    <>
      <div
        className="card hero mx-auto mb-5 overflow-hidden rounded-3xl p-0 drop-shadow-2xl"
        style={{
          backgroundImage: `url(https://cdn1.vectorstock.com/i/1000x1000/17/20/fantasy-game-background-banner-vector-20381720.jpg)`,
        }}
      >
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-md">
            <h1 className="mb-3 text-5xl font-bold">House: {householdName}</h1>
            <p className="mb-5">
              Level up and surpass your peers by completing chores and earning
              XP. Your xp will be used to trade for gold and as we know gold is
              PRICELESS.
            </p>
            <button className="btn btn-primary">Get Started</button>
          </div>
        </div>
      </div>

      <div className="mx-auto  flex-row gap-3 md:flex">
        {profiles.map((profile) => (
          <div className="md:min-w-200 card mb-5 basis-full bg-base-100 shadow-xl">
            <div className="">
              <figure>
                <img src={profile.avatar_url} alt="Profile image" />
              </figure>
              <div class="card-body">
                <h2 class="card-title mx-auto">{profile.username}</h2>
                <p className="mx-auto">profile tag line?</p>
                <div class="card-actions justify-center">
                  <Link href="/profile">
                    <button class="btn btn-primary">Profile page</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default clan