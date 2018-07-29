import sys
import zerorpc

class CartPoleApi(object):
    def step(self):
        return "step"
    
def parsePort():
    return '4242'

def main():
    addr = 'tcp://127.0.0.1:' + parsePort()
    server = zerorpc.Server(CartPoleApi())
    server.bind(addr)
    print('started running on {}'.format(addr))
    server.run()

if __name__ == '__main__':
    main()