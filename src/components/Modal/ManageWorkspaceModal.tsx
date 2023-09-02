import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  addWorkSpace,
  switchWorkSpace,
  toggleManageWorkspaceModal,
} from '../../redux/slices/WorkspaceSlice';
import ModalContainer from './ModalContainer';
import { useNavigate } from 'react-router-dom';
import { BiLeftArrow } from 'react-icons/bi';
import { useState } from 'react';
import { RiCloseLine, RiEmojiStickerFill } from 'react-icons/ri';
import { toast, ToastContainer } from 'react-toastify';
import EmojiPicker, { Theme } from 'emoji-picker-react';
interface formDataType {
  workspaceName: string;
  workspaceEmoji: string;
}

const ManageWorkspaceModal = ({ home = false }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { workSpaces, currentWorkSpace } = useAppSelector(
    (state) => state.workspaceState
  );
  const EmojiPickerTheme = Theme.AUTO;

  const [formData, setFormData] = useState<formDataType>({
    workspaceName: '',
    workspaceEmoji: '',
  });
  const [showInputs, setShowInputs] = useState(home);

  const handleFromDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: formDataType): formDataType => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const chanegWorkspace = (key: string) => {
    dispatch(switchWorkSpace({ name: key }));
    navigate(`/webAppsHome/${key}`);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (workSpaces.hasOwnProperty(formData.workspaceName.toLowerCase())) {
      toast('Worspace Already Exist ', { type: 'info' });
      return;
    }
    dispatch(
      addWorkSpace({
        name: formData.workspaceName.toLowerCase(),
        emoji: formData.workspaceEmoji,
      })
    );
  };

  const AllWorkspaces = () => {
    return Object.entries(workSpaces).sort((a, b) =>
      a[1].webViews.length < b[1].webViews.length ? 1 : -1
    );
  };

  const onEmojiSelect = (data: any) => {
    setFormData((prev) => ({ ...prev, workspaceEmoji: data.emoji }));
    setShowEmojiPicker(!showEmojiPicker);
  };

  return (
    <ModalContainer
      toggleModal={() => dispatch(toggleManageWorkspaceModal())}
      outerContainerStyles={{ zIndex: 50, justifyContent: 'flex-start' }}
      innerContainerStyles={{ width: '320px', height: '100%' }}
    >
      {!home && (
        <section>
          <h1
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => {
              dispatch(toggleManageWorkspaceModal());
              navigate('/');
            }}
          >
            <BiLeftArrow /> Dashboard
          </h1>

          <hr className="my-3" />

          <h1 className="font-medium mb-3">Choose Workspace</h1>

          {/* workspace items container  */}
          <div className="flex flex-col gap-3">
            {/* workspace item  */}
            {AllWorkspaces().map(([key, value], index) => (
              <div
                key={index}
                onClick={() => chanegWorkspace(key)}
                className={`${
                  currentWorkSpace === key
                    ? 'border-blue-400'
                    : 'border-gray-100 dark:border-dark hover:border-gray-200'
                }  border-2 p-2 h-fit text-gray-500 dark:bg-dark dark:text-white relative w-full cursor-pointer rounded-lg text-sm bold flex justify-between items-center `}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="bg-blue-100 dark:bg-darker rounded-md text-center flex justify-center items-center"
                    style={{ width: '50px', height: '50px' }}
                  >
                    <p className="text-2xl">{value.workspaceDetails.emoji}</p>
                  </div>
                  <div className="mb-2">
                    <p className="text-md capitalize ">{key} Workspace </p>
                    <p className="text-xs">
                      {' '}
                      Contains {value.webViews.length}{' '}
                      {value.webViews.length > 1 ? 'Apps' : 'App'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <hr className="my-4" />
        </section>
      )}

      {showInputs && (
        <form
          className="w-full h-fit flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <div className="flex justify-between items-center">
            <h1>Create Workspace</h1>
            {!home && (
              <div
                className="bg-gray-100 dark:bg-dark w-5 cursor-pointer h-5 flex justify-center items-center rounded-full"
                onClick={() => setShowInputs(!showInputs)}
              >
                <RiCloseLine className="text-sm" />
              </div>
            )}
          </div>

          <div className="flex flex-row items-center gap-4">
            <input
              required
              value={formData.workspaceName}
              onChange={handleFromDataChange}
              type="text"
              className="border-2 outline-none  rounded-md w-full px-2 py-1 dark:bg-dark dark:border-dark placeholder:text-sm"
              placeholder="Workspace Name"
              name="workspaceName"
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowEmojiPicker(!showEmojiPicker);
              }}
            >
              {formData.workspaceEmoji !== '' ? (
                <span className="text-2xl">{formData.workspaceEmoji}</span>
              ) : (
                <RiEmojiStickerFill className="text-2xl" />
              )}
            </button>
          </div>
          <button
            type="submit"
            className="bg-blue-500 py-2 w-full rounded-md text-white mb-3"
          >
            Add Workspaces
          </button>
        </form>
      )}

      {showEmojiPicker && (
        <EmojiPicker
          width={'100%'}
          lazyLoadEmojis={true}
          theme={EmojiPickerTheme}
          height={'1000vh'}
          onEmojiClick={onEmojiSelect}
        />
      )}

      {!showInputs && (
        <button
          onClick={() => setShowInputs(!showInputs)}
          className="bg-blue-500 py-2 w-full rounded-md text-white"
        >
          Add Workspaces
        </button>
      )}

      <ToastContainer />
    </ModalContainer>
  );
};

export default ManageWorkspaceModal;
