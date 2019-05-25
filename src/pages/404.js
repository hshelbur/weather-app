import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const NotFoundPage = () => (
  <Layout>
    <SEO title="404: Not found" />
    <h1>Oops... This page doesn't exist</h1>
    <p>Click the link below to go home</p>
    <Link to="/">Go Home</Link>
  </Layout>
)

export default NotFoundPage
