export type ModalType = 'book' | 'clinic' | 'course' | null;

export interface SectionProps {
    onOpenModal?: (type: ModalType) => void;
}
