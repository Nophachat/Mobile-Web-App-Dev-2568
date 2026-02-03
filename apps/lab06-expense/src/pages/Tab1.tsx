import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonText,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

interface Expense {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
}

const Tab1: React.FC = () => {
  const history = useHistory();
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, 'expenses'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Expense, 'id'>),
      }));
      setExpenses(data);
    });

    return () => unsubscribe();
  }, []);

  const totalIncome = expenses
    .filter(e => e.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpense = expenses
    .filter(e => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>รายการรายรับ–รายจ่าย</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>

        {/* 🔢 Summary */}
        <div style={{ padding: '16px' }}>
          <IonText color="success">
            <h2>รายรับรวม: {totalIncome} บาท</h2>
          </IonText>
          <IonText color="danger">
            <h2>รายจ่ายรวม: {totalExpense} บาท</h2>
          </IonText>
        </div>

        {/* 📋 Realtime List */}
        <IonList>
          {expenses.map(item => (
            <IonItem
              key={item.id}
              button
              onClick={() => history.push(`/edit-expense/${item.id}`)}
            >
              <IonLabel>
                <h2>{item.title}</h2>
                <p>{item.category}</p>
              </IonLabel>
              <IonText color={item.type === 'income' ? 'success' : 'danger'}>
                {item.type === 'income' ? '+' : '-'}
                {item.amount}
              </IonText>
            </IonItem>
          ))}
        </IonList>

        {/* ➕ Add Button */}
        <IonButton
          expand="block"
          onClick={() => history.push('/add-expense')}
          style={{ margin: '16px' }}
        >
          เพิ่มรายรับ–รายจ่าย
        </IonButton>

      </IonContent>
    </IonPage>
  );
};

export default Tab1;
