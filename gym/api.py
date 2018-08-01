import sys
import zerorpc
# from cartpole import start, step, reset 

class CartPoleApi(object):
    def start(self):
        # return start()
        return '0'

    def step(self, action):
        # return step(int(action))
        return '0'

    def reset(self):
        # reset()
        return '0'

def main():
    addr = 'tcp://127.0.0.1:4242' 
    server = zerorpc.Server(CartPoleApi())
    server.bind(addr)
    # print('started running on {}'.format(addr))
    server.run()

if __name__ == '__main__':
    main()