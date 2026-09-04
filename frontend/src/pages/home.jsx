import { Link } from "react-router-dom";

import {
  FiArrowRight,
  FiCamera,
  FiBarChart2,
  FiShield,
  FiZap,
  FiCreditCard,
} from "react-icons/fi";


function Home() {

  return (

    <div className="home-page">


      {/* =====================================
          HERO SECTION
      ===================================== */}

      <section className="hero-section">

        <div className="hero-content">

          <div className="hero-badge">

            <FiZap />

            Smart Personal Finance

          </div>


          <h1>

            Take Control Of Your

            <span>
              {" "}Expenses
            </span>

          </h1>


          <p className="hero-description">

            Track your spending, scan receipts
            using OCR, and understand where your
            money goes with a powerful and simple
            expense management dashboard.

          </p>


          <div className="hero-actions">

            <Link
              to="/expenses"
              className="hero-primary-button"
            >

              Manage Expenses

              <FiArrowRight />

            </Link>


            <Link
              to="/dashboard"
              className="hero-secondary-button"
            >

              View Dashboard

            </Link>

          </div>


          <div className="hero-stats">

            <div>

              <strong>
                OCR
              </strong>

              <span>
                Receipt Scanner
              </span>

            </div>


            <div className="stat-divider"></div>


            <div>

              <strong>
                100%
              </strong>

              <span>
                Expense Tracking
              </span>

            </div>


            <div className="stat-divider"></div>


            <div>

              <strong>
                Smart
              </strong>

              <span>
                Analytics
              </span>

            </div>

          </div>

        </div>



        {/* HERO VISUAL */}

        <div className="hero-visual">


          <div className="hero-dashboard-preview">


            <div className="preview-header">

              <div>

                <p>
                  Monthly Spending
                </p>

                <h2>
                  ₹24,850.00
                </h2>

              </div>


              <div className="preview-icon">

                <FiCreditCard />

              </div>

            </div>


            <div className="preview-chart">

              <div className="bar bar-1"></div>

              <div className="bar bar-2"></div>

              <div className="bar bar-3"></div>

              <div className="bar bar-4"></div>

              <div className="bar bar-5"></div>

              <div className="bar bar-6"></div>

              <div className="bar bar-7"></div>

            </div>


            <div className="preview-footer">

              <span>
                Jan
              </span>

              <span>
                Feb
              </span>

              <span>
                Mar
              </span>

              <span>
                Apr
              </span>

              <span>
                May
              </span>

              <span>
                Jun
              </span>

              <span>
                Jul
              </span>

            </div>


          </div>



          {/* FLOATING CARD */}

          <div className="floating-receipt-card">

            <div className="floating-icon">

              <FiCamera />

            </div>


            <div>

              <strong>
                Receipt Scanned
              </strong>

              <span>
                ₹1,250 detected
              </span>

            </div>

          </div>


        </div>

      </section>



      {/* =====================================
          FEATURES
      ===================================== */}

      <section className="features-section">


        <div className="section-title">

          <p className="eyebrow">

            EVERYTHING YOU NEED

          </p>


          <h2>

            Manage Your Expenses
            Smarter

          </h2>


          <p>

            Everything you need to track,
            organize and understand your
            personal spending.

          </p>

        </div>



        <div className="features-grid">


          {/* FEATURE 1 */}

          <div className="feature-card">

            <div className="feature-icon blue-feature">

              <FiCamera />

            </div>


            <h3>

              Receipt OCR Scanner

            </h3>


            <p>

              Upload your receipt and
              automatically extract merchant,
              amount and date information.

            </p>

          </div>



          {/* FEATURE 2 */}

          <div className="feature-card">

            <div className="feature-icon green-feature">

              <FiBarChart2 />

            </div>


            <h3>

              Smart Analytics

            </h3>


            <p>

              Understand your spending habits
              with category insights and
              monthly expense analytics.

            </p>

          </div>



          {/* FEATURE 3 */}

          <div className="feature-card">

            <div className="feature-icon purple-feature">

              <FiShield />

            </div>


            <h3>

              Secure Records

            </h3>


            <p>

              Keep all your expense records
              organized in one secure and
              easy-to-manage location.

            </p>

          </div>


        </div>


      </section>



      {/* =====================================
          CTA
      ===================================== */}

      <section className="home-cta">


        <div>

          <h2>

            Start Managing Your
            Money Today.

          </h2>


          <p>

            Track every expense and get a
            clearer picture of your spending.

          </p>

        </div>


        <Link
          to="/expenses"
          className="cta-button"
        >

          Get Started

          <FiArrowRight />

        </Link>


      </section>


    </div>
  );
}

export default Home;