import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonButton,
    IonList,
} from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useEffect, useState } from 'react';
import { deleteDoc } from 'firebase/firestore';
import { IonAlert } from '@ionic/react';


interface RouteParams {
    id: string;
}

const EditExpense: React.FC = () => {
    const { id } = useParams<RouteParams>();
    const history = useHistory();

    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState<number>(0);
    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [category, setCategory] = useState('');
    const [note, setNote] = useState('');

    const [showAlert, setShowAlert] = useState(false);
    const handleDelete = async () => {
        await deleteDoc(doc(db, 'expenses', id));
        history.push('/tab1');
    };




    useEffect(() => {
        const fetchData = async () => {
            const ref = doc(db, 'expenses', id);
            const snap = await getDoc(ref);
            if (snap.exists()) {
                const data = snap.data();
                setTitle(data.title);
                setAmount(Number(data.amount));
                setType(data.type);
                setCategory(data.category);
                setNote(data.note || '');
            }
        };
        fetchData();
    }, [id]);

    const handleUpdate = async () => {
        await updateDoc(doc(db, 'expenses', id), {
            title,
            amount: Number(amount),
            type,
            category,
            note,
        });

        history.push('/tab1');
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>แก้ไขรายการ</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
                <IonList>
                    <IonItem>
                        <IonLabel position="stacked">ชื่อรายการ</IonLabel>
                        <IonInput value={title} onIonChange={e => setTitle(e.detail.value!)} />
                    </IonItem>

                    <IonItem>
                        <IonLabel position="stacked">จำนวนเงิน</IonLabel>
                        <IonInput
                            type="number"
                            value={amount}
                            onIonChange={e => setAmount(Number(e.detail.value))}
                        />
                    </IonItem>

                    <IonItem>
                        <IonLabel position="stacked">ประเภท</IonLabel>
                        <IonSelect value={type} onIonChange={e => setType(e.detail.value)}>
                            <IonSelectOption value="income">รายรับ</IonSelectOption>
                            <IonSelectOption value="expense">รายจ่าย</IonSelectOption>
                        </IonSelect>
                    </IonItem>

                    <IonItem>
                        <IonLabel position="stacked">หมวดหมู่</IonLabel>
                        <IonInput value={category} onIonChange={e => setCategory(e.detail.value!)} />
                    </IonItem>

                    <IonItem>
                        <IonLabel position="stacked">หมายเหตุ</IonLabel>
                        <IonTextarea value={note} onIonChange={e => setNote(e.detail.value!)} />
                    </IonItem>
                </IonList>

                <IonButton expand="block" onClick={handleUpdate}>
                    บันทึกการแก้ไข
                </IonButton>
                <IonButton
                    expand="block"
                    color="danger"
                    onClick={() => setShowAlert(true)}
                    style={{ marginTop: '12px' }}
                >
                    ลบรายการ
                </IonButton>

                <IonAlert
                    isOpen={showAlert}
                    header="ยืนยันการลบ"
                    message="คุณต้องการลบรายการนี้ใช่หรือไม่?"
                    buttons={[
                        {
                            text: 'ยกเลิก',
                            role: 'cancel',
                            handler: () => setShowAlert(false),
                        },
                        {
                            text: 'ลบ',
                            role: 'destructive',
                            handler: handleDelete,
                        },
                    ]}
                />

            </IonContent>
        </IonPage>
    );
};

export default EditExpense;
