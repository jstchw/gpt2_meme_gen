import nn
from imgmanager import ImgManager
from interface import Interface
from nn import NN

network = NN('124M')

# network.load_model('alice')
# network.generate_text()
# network.load_model('alice')
# network.generate_text()


# Manages the memes
# im = ImgManager(input_img='meme0.jpg', output_img='test_img.gif', )
# im.reformat_image()


#network.download_model()

# network.train_model(file_name='www/img/alice/alice_in_wonderland.txt', run_name='alice', steps=200, sample_length=48)

#network.train_model(file_name='datasets/alice.txt', run_name='alice-no-dot', steps=200,
                    #sample_length=124)

# network.train_model(file_name='www/img/catcher/the-catcher-rye.txt', run_name='catcher', steps=100)

# network.train_model(file_name='www/img/the iliad/the_iliad.txt', run_name='iliad', steps=200)

# print(network.generate_text(run_name='catcher'))
#nn.generate_text(run_name='alice', length=100, nsamples=1)

#print(f'Sample 1: {sample}')
#print(f'Sample 1.1: {sample[0]}')
# print("Sample 2: " + sample[0].rsplit('\n\n', 1)[0])

# print(network.generate_text(run_name='iliad'))


# Creates an instance of a browser using Eel.
gui = Interface()

# Create an instance of Imgmanager class
# img_manager = ImgManager()

# print(img_manager.read_text('www/img/memes/meme3.jpg'))

# Get images from Reddit
# img_manager.get_images()

# Create the window
gui.create_window()

# text = im.read_text()

# im.write_text()


# text = nn.generate_text('alice')
#
# for item in text:
#     print(item)
#     print('NEW STORY')


# text = text[0].split("\n\n")

# limit = 3
#
# for index, item in enumerate(text):
#     print(item)
#     if index == limit:
#         break
