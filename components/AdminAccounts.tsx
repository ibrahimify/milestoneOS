import type { Profile } from '@/types';
import { reviewMentor } from '@/app/actions';
import { formatDate } from '@/lib/utils';
import { ActionButton } from './Forms';

export default function AdminAccounts({ accounts }: { accounts: Profile[] }) {
  return <div className="view-stack">
    <h1>Accounts</h1>
    {(['pending', 'approved', 'suspended', 'rejected'] as const).map((status) => {
      const entries = accounts.filter((item) => item.status === status);
      if (!entries.length && status !== 'pending') return null;
      return <section key={status} className="panel">
        <h2 className="capitalize">{status === 'pending' ? 'Access requests' : status}</h2>
        {!entries.length && <p className="empty">No requests to review.</p>}
        {entries.map((item) => <div className="record-row" key={item.id}>
          <div><strong>{item.nickname}</strong><p className="muted break-all">{item.email} · {formatDate(item.created_at.slice(0, 10))}</p></div>
          <div className="actions">
            {status !== 'approved' && <ActionButton className="button primary" run={() => reviewMentor(item.id, 'approved')}>Approve</ActionButton>}
            {status === 'pending' && <ActionButton run={() => reviewMentor(item.id, 'rejected')}>Decline</ActionButton>}
            {status === 'approved' && <ActionButton confirm="Suspend this mentor’s access?" run={() => reviewMentor(item.id, 'suspended')}>Suspend</ActionButton>}
          </div>
        </div>)}
      </section>;
    })}
  </div>;
}
