import React from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import NotFoundContent from '../components/NotFoundContent'
import Wrapper from '../components/Wrapper'

export default function scan() {
  return (
    <Wrapper>
      <Header />
      <NotFoundContent />
      <Footer />
    </Wrapper>
  )
}
