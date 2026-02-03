import React, { useState } from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonInput,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonButton,
    IonList,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { addDoc, collection, serverTimestamp, getFirestore } from 'firebase/firestore';
import { db } from '../firebase';


const categories = ['อาหาร', 'เดินทาง', 'บันเทิง', 'สุขภาพ', 'อื่น ๆ'];

const AddExpense: React.FC = () => {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState<number | undefined>(undefined);
    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [category, setCategory] = useState('');
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const num = typeof amount === 'number' ? amount : parseFloat(String(amount || '0'));
        if (!title || !num || !type || !category || !isFinite(num)) {
            alert('กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง');
            return;
        }
        setLoading(true);
        const payload = {
            title,
            amount: num,
            type,
            category,
            note,
            createdAt: serverTimestamp(),
        };
        console.log('Saving expense:', payload);
        try {
            const ref = await addDoc(collection(db, 'expenses'), payload);
            console.log('Saved doc id:', ref.id);
            history.replace('/tab1');
        } catch (err: any) {
            console.error('Error saving expense:', err);
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + (err?.message || err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>เพิ่มรายรับ–รายจ่าย</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <form onSubmit={handleSubmit}>
                    <IonList>
                        <IonItem>
                            <IonLabel position="stacked">ชื่อรายการ</IonLabel>
                            <IonInput value={title} onIonChange={(e) => setTitle(e.detail.value!)} required />
                        </IonItem>
                        <IonItem>
                            <IonLabel position="stacked">จำนวนเงิน</IonLabel>
                            <IonInput
                                type="number"
                                value={amount as any}
                                onIonChange={(e) => setAmount(parseFloat(String(e.detail.value || '0')))}
                                required
                            />
                        </IonItem>
                        <IonItem>
                            <IonLabel position="stacked">ประเภท</IonLabel>
                            <IonSelect value={type} onIonChange={(e) => setType(e.detail.value)} required>
                                <IonSelectOption value="income">รายรับ</IonSelectOption>
                                <IonSelectOption value="expense">รายจ่าย</IonSelectOption>
                            </IonSelect>
                        </IonItem>
                        <IonItem>
                            <IonLabel position="stacked">หมวดหมู่</IonLabel>
                            <IonSelect value={category} onIonChange={(e) => setCategory(e.detail.value)} required>
                                {categories.map((cat) => (
                                    <IonSelectOption key={cat} value={cat}>
                                        {cat}
                                    </IonSelectOption>
                                ))}
                            </IonSelect>
                        </IonItem>
                        <IonItem>
                            <IonLabel position="stacked">หมายเหตุ</IonLabel>
                            <IonTextarea value={note} onIonChange={(e) => setNote(e.detail.value!)} />
                        </IonItem>
                    </IonList>
                    <IonButton expand="block" type="submit" disabled={loading}>
                        {loading ? 'กำลังบันทึก...' : 'บันทึก'}
                    </IonButton>
                </form>
            </IonContent>
        </IonPage>
    );
};

export default AddExpense;
