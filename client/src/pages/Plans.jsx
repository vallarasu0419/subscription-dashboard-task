import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PlanCard from '../components/PlanCard.jsx';
import Spinner from '../components/Spinner.jsx';
import ErrorState from '../components/ErrorState.jsx';
import { fetchPlans, selectPlans } from '../features/plans/plansSlice.js';
import {
  subscribe,
  fetchMySubscription,
  selectSubscriptions,
} from '../features/subscriptions/subscriptionsSlice.js';
import { SUBSCRIPTION_STATUS } from '../utils/constants.js';
import styles from './Plans.module.css';

const Plans = () => {
  const dispatch = useDispatch();
  const { items: plans, status, error } = useSelector(selectPlans);
  const { current, subscribingPlanId } = useSelector(selectSubscriptions);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchPlans());
    dispatch(fetchMySubscription());
  }, [dispatch, status]);

  const activePlanId =
    current?.status === SUBSCRIPTION_STATUS.ACTIVE ? current.plan?.id : null;

  const handleSubscribe = (planId) => {
    dispatch(subscribe(planId));
  };

  // Highlight the second plan as "most popular" when there are enough plans.
  const featuredIndex = plans.length >= 3 ? 1 : -1;

  return (
    <div>
      <header className="page-header">
        <h1>Choose a plan</h1>
        <p>Pick the plan that fits your team. Switch or upgrade anytime.</p>
      </header>

      {status === 'loading' && <Spinner center label="Loading plans" />}

      {status === 'failed' && (
        <ErrorState message={error} onRetry={() => dispatch(fetchPlans())} />
      )}

      {status === 'succeeded' && (
        <div className={styles.grid}>
          {plans.map((plan, index) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              featured={index === featuredIndex}
              isCurrent={plan.id === activePlanId}
              isLoading={subscribingPlanId === plan.id}
              onSubscribe={handleSubscribe}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Plans;
