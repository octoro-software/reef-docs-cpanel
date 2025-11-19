import { PostMoreSettingsModal } from "../elements/Modals/PostMoreSettingsModal/PostMoreSettingsModal";
import { HelpPostModal } from "../elements/Modals/HelpPostModal/HelpPostModal";
import { DiseaseInfoModal } from "../elements/Modals/DiseaseInfoModal/DiseaseInfoModal";
import { DosingCardModal } from "../elements/Modals/DosingCardModal/DosingCardModal";
import { EngagementPointsHelpModal } from "../elements/Modals/EngagementPointsHelpModal/EngagementPointsHelpModal";
import { FriendOrFoeHelpModal } from "../elements/Modals/FriendOrFoeHelpModal/FriendOrFoeHelpModal";
import { HomeTestCreateModal } from "../elements/Modals/HomeTestCreateModal/HomeTestCreateModal";
import { ICPImportModal } from "../elements/Modals/ICPImportModal/ICPImportModal";
import { ICPImportPreviewModal } from "../elements/Modals/ICPImportPreviewModal/ICPImportPreviewModal";
import { LiveStockCardLongPressModal } from "../elements/Modals/LiveStockCardLongPressModal/LiveStockCardLongPressModal";
import { LiveStockContributionInfoModal } from "../elements/Modals/LiveStockContributionInfoModal/LiveStockContributionInfoModal";
import { LiveStockExtraDataModal } from "../elements/Modals/LiveStockExtraDataModal/LiveStockExtraDataModal";
import { LiveStockVoteModal } from "../elements/Modals/LiveStockVoteModal/LiveStockVoteModal";
import { SubscriptionModal } from "../elements/Modals/SubscriptionModal/SubscriptionModal";
import { TankModal } from "../elements/Modals/TankModal/TankModal";
import { TestHistoryCsvImportModal } from "../elements/Modals/TestHistoryCsvImportModal/TestHistoryCsvImportModal";
import { TestSettingsModal } from "../elements/Modals/TestSettingsModal/TestSettingsModal";
import { UserPostShareTankModal } from "../elements/Modals/UserPostShareTankModal/UserPostShareTankModal";
import { UserSettingsModal } from "../elements/Modals/UserSettingsModal/UserSettingsModal";
import { LiveStockProfileUserExperiencesModal } from "../elements/Modals/LiveStockProfileUserExperiencesModal/LiveStockProfileUserExperiencesModal";
import { LiveStockProfileUserVideosModal } from "../elements/Modals/LiveStockProfileUserVideosModal/LiveStockProfileUserVideosModal";
import { LiveStockProfileUserPhotosModal } from "../elements/Modals/LiveStockProfileUserPhotosModal/LiveStockProfileUserPhotosModal";
import { LiveStockFilterModal } from "../elements/Modals/LiveStockFilterModal/LiveStockFilterModal";
import { LiveStockRequestFormModal } from "../elements/Modals/LiveStockRequestFormModal/LiveStockRequestFormModal";
import { TankTaskOptionsModal } from "../elements/Modals/TankTaskOptionsModal/TankTaskOptionsModal";
import { TankTaskModal } from "../elements/Modals/TankTaskModal/TankTaskModal";
import { TankTaskSettingsModal } from "../elements/Modals/TankTaskSettingsModal/TankTaskSettingsModal";
import { RelatedProductModal } from "../elements/Modals/RelatedProductModal/RelatedProductModal";
import { RelatedArticlesModal } from "../elements/Modals/RelatedArticlesModal/RelatedArticlesModal";
import { PhoneVerificationModal } from "../elements/Modals/PhoneVerificationModal/PhoneVerificationModal";
import { LiveStockNameModal } from "../elements/Modals/LiveStockNameModal/LiveStockNameModal";
import { RichTextModal } from "../elements/Modals/RichTextModal/RichTextModal";
import { TankEditTasksModal } from "../elements/Modals/TankEditTasksModal/TankEditTasksModal";
import { DevModal } from "../elements/Modals/DevModal/DevModal";
import { FeedbackModal } from "../elements/Modals/FeedbackModal/FeedbackModal";
import { WhileYouWaitModal } from "../elements/Modals/WhileYouWaitModal/WhileYouWaitModal";
import { TestMoreOptionsModal } from "../elements/Modals/TestMoreOptionsModal/TestMoreOptionsModal";
import { StoreSignupModal } from "../elements/Modals/StoreSignupModal/StoreSignupModal";
import { WhatsNewModal } from "../elements/Modals/WhatsNewModal/WhatsNewModal";
import { PostResourceModal } from "../elements/Modals/PostResourceModal/PostResourceModal";
import { PostCommentsModal } from "../elements/Modals/PostCommentsModal/PostCommentsModal";
import { PostTagResultsModal } from "../elements/Modals/PostTagResultsModal/PostTagResultsModal";
import { PostMarkAsResolvedModal } from "../elements/Modals/PostMarkAsResolvedModal/PostMarkAsResolvedModal";
import { ICPTestCreateModal } from "../elements/Modals/ICPTestCreateModal/ICPTestCreateModal";
import { SocialTermsModal } from "../elements/Modals/SocialTermsModal/SocialTermsModal";
import { DosingCreateModal } from "../elements/Modals/DosingCreateModal/DostingCreateModal";
import { FTUModal } from "../elements/Modals/FTUModal/FTUModal";
import { LiveStockSuggestEdits } from "../elements/Modals/LiveStockSuggestEdits/LiveStockSuggestEdits";
import { ImageFullScreenModal } from "../elements/Modals/ImageFullScreenModal/ImageFullScreenModal";
import { NdocCreateModal } from "../elements/Modals/NdocCreateModal/NdocCreateModal";
import { TankProgressModal } from "../elements/Modals/TankProgressModal/TankProgressModal";
import { PartnerStoreModal } from "../elements/Modals/PartnerStoreModal/PartnerStoreModal";
import { SocialProfileModal } from "../elements/Modals/SocialProfileModal/SocialProfileModal";
import { SocialHelpModal } from "../elements/Modals/SocialHelpModal/SocialHelpModal";

export type ModalRegistryTypes = keyof typeof ModalRegistry;

export const ModalRegistry = {
  liveStockCardLongPressOptions: LiveStockCardLongPressModal,
  icpImportModal: ICPImportModal,
  icpImportPreviewModal: ICPImportPreviewModal,
  testHistoryCsvImport: TestHistoryCsvImportModal,
  homeTestCreateModal: HomeTestCreateModal,
  userSettingsModal: UserSettingsModal,
  dosingCardModal: DosingCardModal,
  liveStockVoteModal: LiveStockVoteModal,
  liveStockContributionInfoModal: LiveStockContributionInfoModal,
  liveStockExtraDataModal: LiveStockExtraDataModal,
  tankModal: TankModal,
  testMoreOptionsModal: TestMoreOptionsModal,
  subscriptionModal: SubscriptionModal,
  diseaseInfoModal: DiseaseInfoModal,
  postMoreSettingsModal: PostMoreSettingsModal,
  helpPostModal: HelpPostModal,
  friendOrFoeHelpModal: FriendOrFoeHelpModal,
  engagementPointsHelpModal: EngagementPointsHelpModal,
  userPostShareTankModal: UserPostShareTankModal,
  testSettingsModal: TestSettingsModal,
  liveStockProfileUserExperienceModal: LiveStockProfileUserExperiencesModal,
  liveStockProfileUserVideosModal: LiveStockProfileUserVideosModal,
  liveStockProfileUserPhotosModal: LiveStockProfileUserPhotosModal,
  liveStockFilterModal: LiveStockFilterModal,
  liveStockRequestFormModal: LiveStockRequestFormModal,
  tankTaskOptionsModal: TankTaskOptionsModal,
  tankTaskModal: TankTaskModal,
  tankTaskSettingsModal: TankTaskSettingsModal,
  relatedProductModal: RelatedProductModal,
  relatedArticlesModal: RelatedArticlesModal,
  phoneVerificationModal: PhoneVerificationModal,
  liveStockNameModal: LiveStockNameModal,
  richTextModal: RichTextModal,
  tankEditTasksModal: TankEditTasksModal,
  devModal: DevModal,
  feedbackModal: FeedbackModal,
  whileYouWaitModal: WhileYouWaitModal,
  storeSignupModal: StoreSignupModal,
  whatsNewModal: WhatsNewModal,
  socialHelpModal: SocialHelpModal,
  socialTermsModal: SocialTermsModal,
  postResourceModal: PostResourceModal,
  postCommentsModal: PostCommentsModal,
  postTagResultsModal: PostTagResultsModal,
  postMarkAsResolvedModal: PostMarkAsResolvedModal,
  icpTestCreateModal: ICPTestCreateModal,
  dosingCreateModal: DosingCreateModal,
  ftuModal: FTUModal,
  liveStockSuggestEdits: LiveStockSuggestEdits,
  imageFullScreenModal: ImageFullScreenModal,
  ndocCreateModal: NdocCreateModal,
  tankProgressModal: TankProgressModal,
  partnerStoreModal: PartnerStoreModal,
  socialProfileModal: SocialProfileModal,
};
